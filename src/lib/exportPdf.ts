import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default async function exportPdf(order: any, clientData: any) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const responseClients = await fetch('/api/clientes');
    const dataClients = await responseClients.json();
    const clients = dataClients.clients;

    console.log(clientData);
    // Crie um elemento HTML para capturar a ordem de serviço
    const content = document.createElement('div');
    content.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 17px; color: #333;">
            <h1 style="text-align: center; color: #2a2a2a;">${clientData.empresa}</h1>
            <hr style="border: 1px solid #ddd; margin: 10px 0;">
            <div style="display: flex; justify-content: center; gap: 20px;">
                <h2 style="color: #2a2a2a;">Instagram: @${clientData.instagram}</h2>
                <h2 style="color: #2a2a2a;">Telefone: ${clientData.telefone}</h2>
            </div>
            <h2 style="text-align: center; color: #2a2a2a;">${clientData.endereco}</h2>
            <p style="text-align: right; color: #777;">${new Date().toLocaleDateString('pt-BR')}</p>
            <hr style="border: 1px solid #ddd; margin: 20px 0;">

            <h2 style="font-size: 40px; text-align: center; color: #2a2a2a;">Ordem de Serviço #${order.id}</h2>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <p style="font-size: 25px;"><strong>Cliente:</strong> ${clients.find((client: any) => client.id === order.client_id)?.name || 'Cliente não encontrado'}</p>
                <p style="font-size: 25px;"><strong>Status:</strong> ${order.status}</p>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <p style="font-size: 25px;"><strong>Previsão de Início:</strong> ${new Date(order.date_start).toLocaleDateString('pt-BR')}</p>
                <p style="font-size: 25px;"><strong>Previsão de Finalização:</strong> ${new Date(order.date_end).toLocaleDateString('pt-BR')}</p>
            </div>
            <p style="font-size: 25px;"><strong>Produto:</strong> ${order.product}</p>
            <p style="font-size: 25px;"><strong>Descrição:</strong> ${order.description}</p>
            <p style="font-size: 25px;"><strong>Materiais:</strong> ${order.materials}</p>

            <p style="font-size: 25px; font-weight: bold;">Forma de Pagamento:</p>
            <p style="font-size: 25px; color: #2a2a2a;">${order.payment_id === 4 ? 'PIX' : order.payment_id === 2 ? 'CARTÃO' : 'DINHEIRO'}</p>
            </div>

            <p><strong>Observações:</strong> ${order.observation}</p>
            <p><strong>Condições:</strong> ${order.conditions}</p>
        </div>
    `;

    // Adicione o conteúdo ao DOM temporariamente
    document.body.appendChild(content);

    // Use html2canvas para capturar o conteúdo
    try {
        const canvas = await html2canvas(content, { useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        doc.save(`ordem_servico_${order.id}.pdf`);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
    } finally {
        // Remova o conteúdo do DOM
        document.body.removeChild(content);
    }
}