import { useCallback } from "react"

interface PrintOptions {
  paperWidth?: "58mm" | "80mm"
  onBeforePrint?: () => void
  onAfterPrint?: () => void
}

export function useThermalPrint(options: PrintOptions = {}) {
  const { paperWidth = "80mm", onBeforePrint, onAfterPrint } = options

  const print = useCallback(
    (contentHtml: string) => {
      const printWindow = window.open("", "_blank", "width=400,height=600")
      if (!printWindow) {
        alert("Permita popups para imprimir.")
        return
      }

      const width = paperWidth === "58mm" ? "48mm" : "72mm"

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Pedido</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              @page {
                margin: 4mm 2mm;
                size: ${paperWidth} auto;
              }

              body {
                font-family: 'Courier New', Courier, monospace;
                font-size: 10px;
                line-height: 1.4;
                width: ${width};
                color: #000;
                background: #fff;
              }

              .thermal-receipt {
                width: 100%;
              }

              /* Cabeçalho */
              .receipt-header {
                text-align: center;
                margin-bottom: 6px;
                padding-bottom: 6px;
                border-bottom: 1px dashed #000;
              }

              .receipt-header .store-name {
                font-size: 14px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
              }

              .receipt-header .store-info {
                font-size: 9px;
                margin-top: 2px;
              }

              /* Número do pedido */
              .order-number {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin: 6px 0;
                padding: 4px 0;
                border-top: 1px dashed #000;
                border-bottom: 1px dashed #000;
              }

              /* Info do pedido */
              .order-meta {
                margin-bottom: 6px;
                font-size: 9px;
              }

              .order-meta .meta-row {
                display: flex;
                justify-content: space-between;
              }

              /* Separador */
              .divider {
                border: none;
                border-top: 1px dashed #000;
                margin: 5px 0;
              }

              .divider-solid {
                border: none;
                border-top: 1px solid #000;
                margin: 5px 0;
              }

              /* Itens */
              .items-header {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                font-size: 9px;
                margin-bottom: 3px;
              }

              .item-row {
                margin-bottom: 4px;
              }

              .item-line {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
              }

              .item-qty-name {
                flex: 1;
                margin-right: 4px;
              }

              .item-qty {
                font-weight: bold;
                margin-right: 3px;
              }

              .item-name {
                word-break: break-word;
              }

              .item-price {
                text-align: right;
                white-space: nowrap;
              }

              .item-obs {
                font-size: 9px;
                margin-left: 12px;
                color: #333;
              }

              /* Adicionais */
              .item-addon {
                display: flex;
                justify-content: space-between;
                font-size: 9px;
                margin-left: 12px;
                color: #333;
              }

              /* Totais */
              .totals {
                margin-top: 6px;
              }

              .total-row {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                margin-bottom: 2px;
              }

              .total-row.grand-total {
                font-size: 13px;
                font-weight: bold;
                margin-top: 3px;
                padding-top: 3px;
                border-top: 1px solid #000;
              }

              .total-row.discount {
                color: #000;
              }

              /* Pagamento */
              .payment-section {
                margin-top: 5px;
                font-size: 10px;
              }

              .payment-row {
                display: flex;
                justify-content: space-between;
              }

              /* Entrega */
              .delivery-section {
                margin-top: 5px;
                font-size: 9px;
              }

              .delivery-section .label {
                font-weight: bold;
                font-size: 10px;
              }

              /* Rodapé */
              .receipt-footer {
                text-align: center;
                margin-top: 8px;
                padding-top: 6px;
                border-top: 1px dashed #000;
                font-size: 9px;
              }

              /* Observação geral */
              .order-obs {
                margin-top: 5px;
                padding: 4px;
                border: 1px dashed #000;
                font-size: 9px;
              }

              .order-obs .obs-label {
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            ${contentHtml}
          </body>
        </html>
      `)

      printWindow.document.close()

      printWindow.onload = () => {
        onBeforePrint?.()
        printWindow.focus()
        printWindow.print()
        printWindow.onafterprint = () => {
          printWindow.close()
          onAfterPrint?.()
        }
        // Fallback para browsers que não suportam onafterprint
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close()
            onAfterPrint?.()
          }
        }, 3000)
      }
    },
    [paperWidth, onBeforePrint, onAfterPrint],
  )

  return { print }
}
