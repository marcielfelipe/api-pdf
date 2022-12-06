import { Injectable } from '@nestjs/common';
import axios from 'axios';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async getRepos(): Promise<any[]> {
    const { data } = await axios.get(
      'https://api.github.com/users/marcielfelipe/repos',
    );
    return data;
  }
  async getPdf(): Promise<any[]> {
    const repos = await this.getRepos();

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };

    const printer = new PdfPrinter(fonts);

    const body = [];
    for await (const repo of repos) {
      const row = [];
      row.push(repo.id);
      row.push(repo.name);
      row.push(repo.full_name);

      body.push(row);
    }
    const docDefinitions: TDocumentDefinitions = {
      defaultStyle: { font: 'Helvetica' },
      content: [
        {
          table: {
            body: [['id', 'name', 'full_name'], ...body],
          },
        },
      ],
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinitions);

    // pdfDoc.pipe(fs.createWriteStream('Relatório.pdf'))
    const chunks = [];
    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.end();
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);
      return result;
    });
  }
}
