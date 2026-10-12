export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} DRC Sponsoring Link — Étude de marché sur le sponsoring en RDC</p>
          <p className="text-xs">Vos réponses sont traitées de manière anonyme et confidentielle.</p>
        </div>
      </div>
    </footer>
  )
}
