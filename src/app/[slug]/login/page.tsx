import LoginButton from "@/components/LoginButton"
import Image from "next/image"

export default async function EstablishmentLogin() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Lado esquerdo */}
      <div className="flex flex-col justify-between gap-4 bg-[#1B3D54] p-6 lg:p-12">
        <div className="flex items-center gap-3">
          <Image src="/logo-rangooo.png" alt="Logo" width={40} height={40} />
          <span className="font-serif text-xl text-[#EFE9CE]">Rangooo</span>
        </div>
        <div>
          <h1 className="mb-4 font-serif text-2xl leading-tight font-light text-[#EFE9CE] lg:text-5xl">
            Seu delivery mais rápido,
            <br />
            seu negócio mais organizado.
            <br />O<span className="text-[#C2AB9F]">Rangooo</span> cuida de
            tudo.
          </h1>
          <p className="text-sm font-light text-[#EFE9CE]/50">
            Plataforma administrativa para os estabelecimentos e sua equipe.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="h-1.5 w-5 rounded-full bg-[#C2AB9F]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#C2AB9F]/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#C2AB9F]/30" />
        </div>
      </div>

      {/* Lado direito */}
      <div className="flex flex-1 items-center justify-center bg-[#EFE9CE] p-6 lg:px-12 lg:py-14">
        <div className="flex flex-col justify-center lg:w-120 lg:gap-10">
          <div>
            <h2 className="mb-2 font-serif text-3xl text-[#1B3D54]">
              Bem-vindo de volta
            </h2>
            <p className="mb-10 text-sm text-[#8a7f72]">
              Acesse o painel com sua conta Google autorizada.
            </p>
          </div>
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#1B3D54]/15" />
              <span className="text-[10px] tracking-widest text-[#b0a597] uppercase">
                acesso restrito
              </span>
              <div className="h-px flex-1 bg-[#1B3D54]/15" />
            </div>
            <LoginButton />
            <div className="bg-[#1B3D54]/06 mt-8 rounded-lg p-4 text-xs leading-relaxed text-[#6b6259]">
              <strong className="text-[#1B3D54]">Acesso controlado.</strong>{" "}
              Apenas usuários cadastrados previamente pela administração podem
              entrar.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
