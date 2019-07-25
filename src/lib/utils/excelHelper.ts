import { provide } from 'midway';
import * as XLSX from 'xlsx';

@provide('excelHelper')
export class excelHelper {
    /**
     * 将excel转化成json数据
     * @param filename excel文件路径
     */
    excelToJson(filename) {
        var workbook = XLSX.readFile(filename);
        // 获取 Excel 中所有表名
        var sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
        // 根据表名获取对应某张表
        var worksheet = workbook.Sheets[sheetNames[0]];
        var tempArray = XLSX.utils.sheet_to_json(worksheet);
        return tempArray;
    }

    /**
     * 将json数据转化成excel
     * @param _headers 表格头
     * @param _data 表格数据
     * @param filename 文件名
     */
    jsonToExcel(_headers, _data, filename) {
        var m = 0;
        var headers = _headers.map((v, i) => {
            if (i % 26 == 0 && i >= 26) {
                m++;
            }
            let code = i - m * 25;
            let pos = String.fromCharCode(code + 65) + 1;
            if (m != 0) {
                pos = String.fromCharCode(m + 64) + pos;
            }
            return Object.assign({}, { v: v, position: pos });
        }).reduce((prev, next) => Object.assign({}, prev, {
            [next.position]: { v: next.v }
        }), {});

        var data = _data.map((v, i) => {
            m = 0;
            return _headers.map((k, j) => {
                if (j % 26 == 0 && j >= 26) {
                    m++;
                }
                let code = j - m * 25;
                let pos = String.fromCharCode(code + 65) + (i + 2);
                if (m != 0) {
                    pos = String.fromCharCode(m + 64) + pos;
                }
                return Object.assign({}, { v: v[k], position: pos });
            })
        })
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, {
                [next.position]: { v: next.v }
            }), {});
        // 合并 headers 和 data
        var output = Object.assign({}, headers, data);
        // 获取所有单元格的位置
        var outputPos = Object.keys(output);
        // 计算出范围
        var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
        // 构建 workbook 对象
        var wb = {
            SheetNames: ['sheet1'],
            Sheets: {
                'sheet1': Object.assign({}, output, { '!ref': ref })
            }
        };

        XLSX.writeFile(wb, filename);
    }
}