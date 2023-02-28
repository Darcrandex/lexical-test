import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'

// 编辑器原生支持的节点
export const baseNodes = [HeadingNode, QuoteNode, ListNode, ListItemNode, TableCellNode, TableNode, TableRowNode]
