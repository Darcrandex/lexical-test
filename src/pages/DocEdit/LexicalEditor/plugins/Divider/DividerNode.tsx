import {
  DecoratorNode,
  NodeKey,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
  EditorConfig,
  DOMExportOutput,
  LexicalEditor,
} from 'lexical'
import DividerComponent, { DividerComponentProps } from './DividerComponent'

const DIVIDER_NODE_TYPE = 'divider-node'

export type SerializedDividerNode = Spread<
  {
    nodeKey: string
    props?: DividerComponentProps
    type: 'divider-node'
  },
  SerializedLexicalNode
>

export default class DividerNode extends DecoratorNode<JSX.Element> {
  __props?: DividerComponentProps

  constructor(props?: DividerComponentProps, key?: NodeKey) {
    super(key)
    this.__props = props
  }

  static getType() {
    return DIVIDER_NODE_TYPE
  }

  static clone(node: DividerNode): DividerNode {
    return new DividerNode(node.__props, node.__key)
  }

  static importJSON(serializedNode: SerializedDividerNode): DividerNode {
    return $createDividerNode(serializedNode.props)
  }

  exportJSON(): SerializedDividerNode {
    return { nodeKey: this.getKey(), props: this.__props, type: DIVIDER_NODE_TYPE, version: 1 }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div')
    div.className = 'lexical-divider'
    return div
  }

  updateDOM(): false {
    return false
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div')
    element.setAttribute('data-lexical-node-key', this.__key)
    // 导入时还没有设置对应的样式
    return { element }
  }

  // 更新组件的 props
  setProps(props: Partial<DividerComponentProps>) {
    const writable = this.getWritable()
    writable.__props = { ...this.__props, ...props }
  }

  // 渲染组件
  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return <DividerComponent nodeKey={this.getKey()} {...this.__props} />
  }
}

export function $createDividerNode(props?: DividerComponentProps): DividerNode {
  return new DividerNode(props)
}

export function $isDividerNode(node: LexicalNode | null | undefined): node is DividerNode {
  return node instanceof DividerNode
}
