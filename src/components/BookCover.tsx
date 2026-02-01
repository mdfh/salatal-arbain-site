import Image from "next/image";

export default function BookCover() {
  return (
    <section className="w-full bg-[#2C5F34]">
      <div className="mx-auto max-w-6xl px-4">
        <Image
          src="/cover-bg-full.png"
          alt="Book cover"
          width={1400}
          height={2000}
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="w-full h-auto rounded-1xl shadow-lg"
        />
      </div>
    </section>
  );
}
