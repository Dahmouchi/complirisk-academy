import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Edit2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateStudentPicture } from "@/actions/student";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FileUpload } from "../student/StudentProfile";
import Link from "next/link";

interface ProfileHeaderProps {
  user: any;
  name: string;
  role: string;
  prenom: string;
  department: string;
  avatarUrl?: string;
}

const ProfileHeader = ({
  user,
  name,
  role,
  prenom,
  department,
  avatarUrl,
}: ProfileHeaderProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const [image, setImage] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useRouter();

  // Create preview URL when image is selected
  useEffect(() => {
    if (image.length > 0) {
      const objectUrl = URL.createObjectURL(image[0]);
      setPreviewUrl(objectUrl);

      // Cleanup function to revoke object URL
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleSaveImage = async () => {
    try {
      const res = await updateStudentPicture(image[0], user.id);
      if (res) {
        toast.success("Image saved successfully");
        setImage([]);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-between p-6 bg-card rounded-[6px] border border-border/50 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-primary shadow-xl">
            <AvatarImage src={previewUrl || user?.image} alt={user.name} />
            <AvatarFallback className="bg-blue-600 text-blue-600-foreground text-3xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <FileUpload
            onFileSelect={(files) => setImage(files)}
            accept="image/*"
            label="Changer d'avatar"
            description="Chercher une image"
          />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">
              {name} {prenom}
            </h2>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-0"
            >
              {role}
            </Badge>
          </div>

          <p className="text-muted-foreground">{department}</p>
          {image.length > 0 && (
            <Button
              className="gap-2 mt-2 cursor-pointer rounded-[6px] bg-green-600 text-white"
              onClick={handleSaveImage}
            >
              <Edit2 className="h-4 w-4" />
              save picture
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
        <Link href="/teacher/dashboard/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileHeader;
