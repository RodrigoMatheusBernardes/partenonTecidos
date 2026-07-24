// ... (código anterior até o bloco de exibição)

{/* BADGE DE DESCONTO – METALLIC NAVY */}
{descontoPercentual > 0 && (
  <div className="absolute top-3 left-3 z-10 bg-metallic-navy text-white text-[10px] font-medium px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
    -{descontoPercentual}%
  </div>
)}

{/* PREÇO – METALLIC NAVY */}
<div className="flex flex-col gap-1">
  <div className="flex items-baseline gap-2">
    <span className="text-3xl font-bold text-metallic-navy">
      R$ {preco.toFixed(2)}
    </span>
    {/* ... */}
  </div>
  <p className="text-xs text-[#8a7a6a] font-light mt-1">
    ou 3x de R$ {(preco / 3).toFixed(2)}
  </p>
</div>