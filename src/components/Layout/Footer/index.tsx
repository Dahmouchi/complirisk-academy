"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { FooterLinkType } from "@/types/footerlinks";

const Footer = () => {
  const [footerlink, SetFooterlink] = useState<FooterLinkType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        SetFooterlink(data.FooterLinkData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-blue-700" id="first-section">
      <div className="container  pt-60 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-16 xl:gap-8">
          <div className="col-span-4 flex flex-col gap-5">
            <div className="bg-white p-2 rounded-lg w-fit">
              <Image
                src="/compli/logo.png"
                alt="Logo"
                width={150}
                height={64}
              />
            </div>
            <p className="text-white text-lg font-medium leading-7">
              {" "}
              Formez-vous aux standards internationaux et pilotez la conformité
              et les risques avec impact.
            </p>
            <div className="flex gap-4">
              <Link
                href="/"
                className="bg-white/20 rounded-full p-2 text-white hover:bg-cream hover:text-primary duration-300"
              >
                <Icon
                  icon="tabler:brand-instagram"
                  className="text-2xl inline-block"
                />
              </Link>
              <Link
                href="/"
                className="bg-white/20 rounded-full p-2 text-white hover:bg-cream hover:text-primary duration-300"
              >
                <Icon
                  icon="tabler:brand-dribbble"
                  className="text-2xl inline-block"
                />
              </Link>
              <Link
                href="/"
                className="bg-white/20 rounded-full p-2 text-white hover:bg-cream hover:text-primary duration-300"
              >
                <Icon
                  icon="tabler:brand-twitter-filled"
                  className="text-2xl inline-block"
                />
              </Link>
              <Link
                href="/"
                className="bg-white/20 rounded-full p-2 text-white hover:bg-cream hover:text-primary duration-300"
              >
                <Icon
                  icon="tabler:brand-youtube-filled"
                  className="text-2xl inline-block"
                />
              </Link>
            </div>
          </div>

          {/* CLOUMN-2/3 */}
          <div className="col-span-4">
            <div className="flex gap-20">
              {footerlink.map((product, i) => (
                <div key={i} className="group relative col-span-2">
                  <p className="text-white text-xl font-semibold mb-9">
                    {product.section}
                  </p>
                  <ul>
                    {product.links.map((item, i) => (
                      <li key={i} className="mb-3">
                        <Link
                          href={item.href}
                          className="text-white/60 hover:text-white text-sm font-normal mb-6"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          {/* CLOUMN-4 */}

          <div className="col-span-4"></div>
        </div>
      </div>
      <div className="py-3">
        <h3 className="text-center text-white/60">
          @{new Date().getFullYear()} - All Rights Reserved by{" "}
          <Link
            href="https://buildalittlebiz.com/"
            target="_blank"
            className="hover:text-white"
          >
            {" "}
            Build A Little Biz
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default Footer;
