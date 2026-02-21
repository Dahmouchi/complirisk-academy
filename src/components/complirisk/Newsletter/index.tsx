import Image from "next/image";

const Newsletter = () => {
  return (
    <section id="join-section" className="-mb-64">
      <div className="relative z-10">
        <div
          className="mx-auto max-w-2xl py-16 md:py-12 px-4 sm:px-6 md:max-w-7xl lg:px-12 rounded-lg bg-newsletter bg-contain bg-no-repeat bg-right-bottom"
          style={{
            backgroundImage: "url(/images/newsletter/test.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 xl:gap-x-8">
            <div className="w-full flex flex-col lg:flex-row items-center gap-4 justify-between">
              <div>
                <h3 className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
                  Restez à la pointe de l&apos;expertise
                </h3>
                <p className="text-white/80 text-lg mb-8 max-w-md">
                  Actualités ISO, conseils en conformité et offres exclusives :
                  recevez l&apos;essentiel de CompliRisk Academy directement
                  dans votre boîte mail.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="Email address"
                  name="q"
                  className="py-4 w-full text-base px-4 bg-white transition-all duration-500 focus:border-primary focus:outline-1 rounded-lg pl-4"
                  placeholder="Enter your email"
                  autoComplete="off"
                />
                <button className="bg-primary cursor-pointer hover:bg-transparent border border-primary hover:text-white text-white font-medium py-2 px-4 rounded-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
