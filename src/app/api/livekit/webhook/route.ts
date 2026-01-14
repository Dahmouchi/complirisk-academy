import { NextRequest, NextResponse } from "next/server";
import { WebhookReceiver } from "livekit-server-sdk";
import prisma from "@/lib/prisma";

/**
 * Initialisation du récepteur de Webhook LiveKit.
 * Assurez-vous que LIVEKIT_API_KEY et LIVEKIT_API_SECRET sont définis dans votre .env
 */
const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: NextRequest) {
  try {
    // 1. Récupération du corps brut et du header d'autorisation
    const body = await req.text();

    // LiveKit peut envoyer l'autorisation via 'Authorization' ou 'livekit-webhook-authorization'
    const header =
      req.headers.get("Authorization") ||
      req.headers.get("livekit-webhook-authorization");

    if (!header) {
      console.error("Webhook LiveKit : Header d'autorisation manquant");
      return NextResponse.json(
        { error: "No authorization header" },
        { status: 401 }
      );
    }

    // 2. Validation de la signature et parsing de l'événement
    // Cette méthode lève une erreur si la signature est invalide
    const event = await receiver.receive(body, header);

    console.log(`Événement LiveKit reçu : ${event.event}`);

    // 3. Traitement spécifique de l'événement "egress_ended"
    if (event.event === "egress_ended" && event.egressInfo) {
      const info = event.egressInfo;
      const egressId = info.egressId;
      const roomName = info.roomName;

      /**
       * Extraction de l'URL de la vidéo.
       * On utilise 'as any' pour éviter l'erreur TypeScript sur la propriété 'file'
       * qui est présente dans le JSON mais pas toujours dans les types stricts du SDK.
       */
      const videoUrl =
        info.fileResults?.[0]?.location || (info as any).file?.location;

      if (videoUrl) {
        console.log(
          `URL de vidéo extraite : ${videoUrl} pour la room : ${roomName}`
        );

        // 4. Mise à jour de la base de données Prisma
        // On utilise updateMany pour être sûr de trouver l'entrée via roomName ou egressId
        const updateResult = await prisma.liveRoom.updateMany({
          where: {
            OR: [{ livekitRoom: roomName }, { egressId: egressId }],
          },
          data: {
            recordingUrl: videoUrl,
            recordingStatus: "COMPLETED",
            status: "ENDED",
            endedAt: new Date(),
          },
        });

        if (updateResult.count > 0) {
          console.log(
            `Succès : ${updateResult.count} session(s) mise(s) à jour.`
          );
        } else {
          console.warn(
            `Attention : Aucune session trouvée dans la DB pour ${roomName} / ${egressId}`
          );
        }
      } else {
        console.warn(
          "Événement egress_ended reçu mais aucune URL de fichier trouvée dans le payload."
        );
      }
    }

    // Toujours répondre avec un succès 200 à LiveKit pour accuser réception
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(
      "Erreur lors du traitement du Webhook LiveKit :",
      error.message
    );
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
