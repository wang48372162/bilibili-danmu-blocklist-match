import fs from 'fs'
import path from 'path'
import c from 'picocolors'

const danmu = process.argv[2]

if (!danmu) {
  console.log(c.red('請輸入查詢文字'))
  process.exit(1)
}

if (!fs.existsSync('bilibili.block.json')) {
  console.log(c.red('請在B站的屏蔽设定內容區右鍵導出 JSON，並將下載的 bilibili.block.json 檔案放在專案資料夾裡。'))
  process.exit(1)
}

enum Type { Text, Regex, User }

const blocklist: {
  id: number
  type: Type
  filter: string
  opened: boolean
}[] = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'bilibili.block.json'), 'utf-8'))

let matchedCount = 0

for (const blockItem of blocklist) {
  if (blockItem.type === Type.Text && danmu.indexOf(blockItem.filter) !== -1) {
    const matchedDanmu = danmu.replace(blockItem.filter, c.cyan(blockItem.filter))
    printBlockItem(blockItem.filter, matchedDanmu)
    matchedCount++
  } else if (blockItem.type === Type.Regex && new RegExp(blockItem.filter).test(danmu)) {
    const matchedText = danmu.match(new RegExp(blockItem.filter))?.[0]
    const matchedDanmu = matchedText
      ? danmu.replace(matchedText, c.cyan(matchedText))
      : danmu
    printBlockItem(`/${blockItem.filter}/`, matchedDanmu)
    matchedCount++
  }
}

if (!matchedCount) {
  console.log(c.green('當前彈幕沒有匹配的屏蔽詞'))
}

function printBlockItem(blockItem: string, danmu: string) {
  console.log(`彈幕: ${danmu}    屏蔽詞: ${c.cyan(blockItem)}`)
}
