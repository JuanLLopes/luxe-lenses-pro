## Escopo

Reescrever `src/routes/index.tsx` mantendo intactos header, banner de promoção e cartão fidelidade (com a animação de latas). Todo o restante será substituído para replicar o comportamento do HTML de referência.

## O que muda

### 1. Estrutura de abas
- Adicionar 3ª aba **🧰 Complementos** (grid de 5 produtos: microfibra, esponja, fita crepe, lixa, polidor).
- Subabas de Tintas permanecem (Retoques / Prontas / Pesadas).

### 2. Estética (grade em 2 colunas com cards)
- Substituir a lista atual por 18 produtos extraídos do HTML (Blend Paste Wax, Blend Spray Wax, Alumax, ceras coloridas, polidores, vitrificador, primer, desengraxante, limpa pneus).
- Cada card: foto, nome, descrição curta, seletor de variação, preço, parcelamento em até 12x sem juros e destaque do **PIX -3%**.
- Botão “+” adiciona ao carrinho com a variação selecionada.
- Suporte a **múltiplas imagens por produto** com clique abrindo o **Lightbox**.

### 3. Lightbox
- Overlay full-screen com imagem principal, contador (`1/4`), botões Anterior/Próximo, fechar com X ou clique fora, navegação por teclado (←/→/Esc).

### 4. Tintas
- Manter os 3 painéis atuais (Retoques, Prontas, Pesadas) e as fontes de dados existentes em `src/data/prontas-colors.ts` (sem regressão).
- Ajustar exibição para adotar o mesmo card visual.

### 5. Complementos
- Nova grade seguindo o mesmo padrão dos cards de estética.

### 6. Carrinho (drawer lateral)
- Substituir o resumo fixo atual por drawer deslizante à direita (mobile: bottom-sheet).
- Lista de itens com metadados customizados (marca/modelo/ano/código, foto anexada) e botão remover.
- **Seletor de loja** (DNS 1 — Jd. Luso / DNS 2 — Vila Santa Catarina) para retirada.
- **Entrega**: Retirada na loja **ou** Motoboy (com campo de endereço obrigatório).
- Totalizador com subtotal, PIX (-3%) e total.

### 7. Modal de identificação
- Antes de enviar o pedido, abrir modal solicitando **Nome** e **WhatsApp** (com máscara `(11) 99999-9999`).
- Persistir cliente em `localStorage` (chave `dns_cliente_<telefone>`) e acumular o total gasto para o cartão fidelidade (R$ 100 = 1 selo, 10 selos = brinde).
- Ao recarregar a página, se houver cliente salvo, restaura selos.

### 8. Envio via WhatsApp
- Mensagem estruturada com cliente, loja escolhida, entrega/endereço, itens com metadados, subtotal, PIX e total.
- Envia para número da loja selecionada. Fotos anexadas disparam download automático para o cliente reencaminhar.

### 9. Botão “Voltar ao topo”
- Botão flutuante circular, aparece após rolar > 300px.

### 10. Rodapé
- Nome da loja, telefones, horários, links Instagram/WhatsApp, copyright.

## Fora do escopo
- **Firebase**: usar apenas `localStorage` (o HTML de referência mantinha Firebase como opcional e caía em fallback local).
- Header, promo e loyalty **não** são alterados.

## Arquivos afetados
- `src/routes/index.tsx` — rewrite grande (mantendo o bloco header/promo/loyalty existente).
- `src/styles.css` — pequenos ajustes (drawer overlay, lightbox z-index, botão back-to-top) se necessário.

Após implementar, rodo `bun run build` para validar.
