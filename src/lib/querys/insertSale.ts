import insertData from './insert';
import selectDataWithCondition from './selectDataWithCondition';
import updateData from './update';

async function insertSale(data: any, res: any) {
    try {
        const items = JSON.parse(data.items);

        const regex = /\d+(\.\d{1,2})?/;
        const subtotal = parseFloat(data.subtotal.match(regex)[0]);

        // Inserir a venda e obter o ID da venda gerada
        const saleId = await insertData('sales', {
            total: subtotal,
            discount: parseFloat(data.discountSale),
            client_id: data.client,
            sale_date: data.date,
            payment_method_id: data.paymentMethod,
        });

        for (const item of items) {
            // Inserir cada produto da venda
            await insertData('sale_products', {
                sale_id: saleId,
                product_id: item.id,
                quantity: parseInt(item.quantity),
                discountProduct: parseFloat(item.discount) || 0
            });

            // Selecionar o produto e atualizar o estoque
            const product = await selectDataWithCondition('products', 'id', item.id);
            const newStock = product[0].stock - parseInt(item.quantity);
            await updateData('products', { stock: newStock }, item.id);
        }

        console.log(`[INFO] Venda gerada com sucesso.`);
        res.status(200).redirect('/sales');
    } catch (err) {
        console.log(`[ERROR] Error(catch) ao gerar a venda ${err}`);
        res.status(200).redirect('/sales');
    }
}

export default insertSale;