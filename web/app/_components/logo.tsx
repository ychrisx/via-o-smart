export default function SmartLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 96" role="img" aria-label="Viação Smart · Transporte e Turismo">
      {/* raio dourado */}
      <polygon points="12,66 22,63 122,82 106,62 206,90 200,94 100,73 116,92" fill="#6b4a12" transform="translate(2 3)" />
      <polygon points="12,66 22,63 122,82 106,62 206,90 200,94 100,73 116,92" fill="#d99a2b" />
      {/* nome */}
      <text x="22" y="57" fontSize="56" fontWeight="900" fontStyle="italic" fill="#5c5c5c" fontFamily="'Arial Black', Arial, sans-serif" letterSpacing="-2">Smart</text>
      <text x="19" y="54" fontSize="56" fontWeight="900" fontStyle="italic" fill="#fff" fontFamily="'Arial Black', Arial, sans-serif" letterSpacing="-2">Smart</text>
      <text x="120" y="13" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">VIAÇÃO</text>
      <text x="128" y="66" fontSize="6.6" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">TRANSPORTE E TURISMO</text>
    </svg>
  );
}
