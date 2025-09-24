import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class Random implements INodeType {
	// Define todas as propriedades visuais e de comportamento do nó na interface do n8n.
	description: INodeTypeDescription = {
		displayName: 'Gerador de Número Aleatório',
		name: 'random',
		icon: 'file:icon.svg',
		group: ['transform'],
		version: 1,
		description: 'Gera um número aleatório verdadeiro usando a API do Random.org',
		defaults: {
			name: 'Número Aleatório',
		},
		inputs: ['main'],
		outputs: ['main'],
		// Define os campos (parâmetros) que o usuário irá preencher na interface.
		properties: [
			{
				displayName: 'Operação',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Gerador de Número Aleatório Verdadeiro',
						value: 'generate',
						action: 'Gerar um número aleatório verdadeiro',
					},
				],
				default: 'generate',
			},
			// Parâmetro para o valor mínimo.
			{
				displayName: 'Mínimo',
				name: 'min',
				type: 'number',
				default: 1,
				required: true,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'O valor inteiro mínimo (inclusivo)',
			},
			// Parâmetro para o valor máximo.
			{
				displayName: 'Máximo',
				name: 'max',
				type: 'number',
				default: 100,
				required: true,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'O valor inteiro máximo (inclusivo)',
			},
		],
	};

	// Método principal que executa a lógica do nó quando o workflow roda.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Itera sobre cada item de entrada para processá-los individualmente.
		for (let i = 0; i < items.length; i++) {
			try {
				// Pega os valores 'min' e 'max' preenchidos pelo usuário.
				const min = this.getNodeParameter('min', i) as number;
				const max = this.getNodeParameter('max', i) as number;

				// Monta a URL da API dinamicamente com os parâmetros.
				const apiUrl = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

				// Faz a requisição HTTP GET para a API usando o helper do n8n.
				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: apiUrl,
					json: false,
					encoding: 'text',
				});

				// Converte a resposta (texto puro) para um número inteiro.
				const randomNumber = parseInt(response.toString().trim(), 10);

				// Prepara o objeto JSON de saída, adicionando a nova chave 'randomNumber'.
				const json = {
					...items[i].json, // Mantém os dados do item original.
					randomNumber,
				};

				// Adiciona o resultado formatado ao array de dados de retorno.
				returnData.push({ json });
			} catch (error) {
				// Gerencia erros que podem ocorrer durante a execução.
				if (this.continueOnFail()) {
					returnData.push({ json: {}, error: error });
				} else {
					throw error;
				}
			}
		}

		// Retorna os dados processados para o próximo nó no workflow.
		return [returnData];
	}
}