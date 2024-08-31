import insertData from './insert';
import selectDataWithCondition from './selectDataWithCondition';
import updateData from './update';

async function insertSale(req: any, data: any, res: any) {
    try {
        const items = JSON.parse(data.items);

        const regex = /\d+(\.\d{1,2})?/;
        const subtotal = parseFloat(data.subtotal.match(regex)[0]);

        const saleId = await insertData(req, 'sales', {
            total: subtotal,
            discount: parseFloat(data.discountSale),
            client_id: data.client,
            sale_date: data.date,
            payment_method_id: data.paymentMethod,
        });

        for (const item of items) {
            await insertData(req, 'sale_products', {
                sale_id: saleId,
                product_id: item.id,
                quantity: parseInt(item.quantity),
                discountProduct: parseFloat(item.discount) || 0
            });

            // Selecionar o produto e atualizar o estoque
            const product = await selectDataWithCondition(req, 'products', 'id', item.id);
            const newStock = product[0].stock - parseInt(item.quantity);
            await updateData(req, 'products', { stock: newStock }, item.id);
        }
        res.status(200).redirect('/sales');
    } catch (err) {
        console.error(`[ERROR] Error(catch) ao gerar a venda ${err}`);
        res.status(200).redirect('/sales');
    }
}

export default insertSale;