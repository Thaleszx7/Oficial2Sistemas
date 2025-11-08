const ExcelJS = require('exceljs');
const Venda = require('../models/Venda');

class ExcelService {
  async gerarRelatorioVendas(filtros) {
    try {
      // Buscar todas as vendas com os filtros aplicados
      const vendas = await Venda.findAllWithFilters(filtros.unidade, filtros.ano);

      // Criar workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Vendas');

      // Configurar metadados
      workbook.creator = 'Sistema de Relatórios';
      workbook.created = new Date();
      workbook.modified = new Date();

      // Adicionar cabeçalho com estilo
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Unidade', key: 'unidade', width: 20 },
        { header: 'Produto', key: 'produto', width: 30 },
        { header: 'Quantidade', key: 'quantidade', width: 15 },
        { header: 'Valor Unitário', key: 'valor_unitario', width: 18 },
        { header: 'Valor Total', key: 'valor_total', width: 18 },
        { header: 'Data da Venda', key: 'data_venda', width: 18 },
        { header: 'Cliente', key: 'cliente', width: 30 }
      ];

      // Estilizar cabeçalho
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2C3E50' }
      };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getRow(1).height = 25;

      // Adicionar dados
      vendas.forEach(venda => {
        worksheet.addRow({
          id: venda.id,
          unidade: venda.unidade,
          produto: venda.produto,
          quantidade: venda.quantidade,
          valor_unitario: venda.valor_unitario,
          valor_total: venda.valor_total,
          data_venda: this.formatarData(venda.data_venda),
          cliente: venda.cliente || 'N/A'
        });
      });

      // Formatar colunas de valores
      worksheet.getColumn('valor_unitario').numFmt = 'R$ #,##0.00';
      worksheet.getColumn('valor_total').numFmt = 'R$ #,##0.00';

      // Adicionar bordas
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });

        // Alternar cores das linhas
        if (rowNumber > 1 && rowNumber % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8F9FA' }
          };
        }
      });

      // Adicionar linha de totais
      if (vendas.length > 0) {
        const totalQuantidade = vendas.reduce((sum, v) => sum + parseFloat(v.quantidade || 0), 0);
        const totalValor = vendas.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0);

        const totalRow = worksheet.addRow({
          id: '',
          unidade: '',
          produto: 'TOTAL',
          quantidade: totalQuantidade,
          valor_unitario: '',
          valor_total: totalValor,
          data_venda: '',
          cliente: ''
        });

        totalRow.font = { bold: true };
        totalRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFE599' }
        };
      }

      // Gerar buffer
      const buffer = await workbook.xlsx.writeBuffer();
      
      const filename = `relatorio_vendas_${this.gerarNomeArquivo(filtros)}.xlsx`;
      
      return {
        buffer,
        filename
      };
    } catch (error) {
      console.error('Erro ao gerar relatório Excel:', error);
      throw error;
    }
  }

  formatarData(data) {
    if (!data) return 'N/A';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  }

  gerarNomeArquivo(filtros) {
    const timestamp = new Date().toISOString().split('T')[0];
    let nome = timestamp;
    
    if (filtros.unidade) {
      nome += `_${filtros.unidade.replace(/\s+/g, '_')}`;
    }
    
    if (filtros.ano) {
      nome += `_${filtros.ano}`;
    }
    
    return nome;
  }
}

module.exports = new ExcelService();