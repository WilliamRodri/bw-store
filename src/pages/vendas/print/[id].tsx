import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import withAuth from "src/lib/withAuth";

const PrintPage = () => {
    const { query, back } = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [clientData, setClientData] = useState<any>([]);

    useEffect(() => {
        const cookies = parseCookies();
        const data = cookies.clientData;
        setClientData(JSON.parse(data));
        console.log(JSON.parse(data));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (query.id) {
                try {
                    const response = await fetch(`/api/sales/${query.id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    setData(data);
                } catch (error) {
                    setError('Error fetching data');
                    console.error('Error fetching printing:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [query.id]);

    useEffect(() => {
        if (!loading && data) {
            window.print();
            window.addEventListener('afterprint', () => {
                window.location.href = '/vendas';
            });
        }
    }, [loading, data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!data) return <p>No data available</p>;

    return (
        <>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Nota de Venda</title>
            </head>
            <body style={{ fontFamily: 'sans-serif', fontSize: '10px' }}>
                <div style={{ width: '48mm' }}>
                    <h4>DOCUMENTO AUXILIAR DE VENDA</h4>
                    <h5>NÃO É DOCUMENTO FISCAL</h5>
                    <hr />
                    <h1>{clientData.empresa}</h1>
                    <p><strong>Instagram: </strong>@{clientData.instagram}</p>
                    <p><strong>WhatsApp: </strong>{clientData.telefone}</p>
                    <p><strong>Endereço: </strong>{clientData.endereco}</p>
                    <hr />
                    <p><strong>Cliente:</strong> {data.client.name}</p>
                    <p><strong>Data da Venda:</strong> {new Date(data.sale.sale_date).toLocaleDateString('pt-BR')}</p>
                    <hr />
                    <h2>Produtos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Qtd.</th>
                                <th>Valor/Unit.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.saleProducts.map((product: any) => (
                                <tr key={product.id}>
                                    <td>{product.product_name}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.unit_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr />
                    <p>Total Itens: {data.saleProducts.length}</p>
                    <hr />
                    <p><strong>Pagamento:</strong> {data.paymentMethod.type_payment}</p>
                    <p><strong>Total:</strong> {parseFloat(data.sale.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <hr />
                    <p>Obrigado pela compra! Volte sempre...</p>
                    <hr />
                    {/* Botão de Voltar */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button
                            onClick={() => back()}
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                borderRadius: '5px',
                                fontSize: '12px'
                            }}
                            className="no-print"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </body>

            {/* Estilos para ocultar o botão na impressão */}
            <style>{`
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}

export default withAuth(PrintPage);