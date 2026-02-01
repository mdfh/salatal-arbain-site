import React from "react";

export default function Section({
  id,
  title,
  children,
  kicker,
}: {
  id: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-14">
      <div className="mx-auto max-w-5xl px-4">
        {kicker ? <p className="text-sm text-black/60">{kicker}</p> : null}
        <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        <div className="mt-5 text-black/75 leading-relaxed">{children}</div>
      </div>
    </section>
  );
}
