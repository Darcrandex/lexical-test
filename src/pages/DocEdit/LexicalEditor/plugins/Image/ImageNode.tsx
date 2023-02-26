import * as lexical from 'lexical'
import { ImageComponent, ImageComponentProps } from './ImageComponent'

export const IMAGE_NODE_TYPE = 'image-node'

export type SerializedImageNode = lexical.Spread<
  {
    nodeKey: string
    props?: ImageComponentProps
    type: 'image-node'
  },
  lexical.SerializedLexicalNode
>

export class ImageNode extends lexical.DecoratorNode<JSX.Element> {
  __props?: ImageComponentProps

  constructor(props?: ImageComponentProps, key?: lexical.NodeKey) {
    super(key)
    this.__props = props || { width: '100%', height: 200 }
  }

  static getType() {
    return IMAGE_NODE_TYPE
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__props, node.__key)
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode(serializedNode.props)
  }

  exportJSON(): SerializedImageNode {
    return { nodeKey: this.getKey(), props: this.__props, type: IMAGE_NODE_TYPE, version: 1 }
  }

  createDOM(config: lexical.EditorConfig): HTMLElement {
    const div = document.createElement('div')
    div.className = 'lexical-block-image'
    return div
  }

  updateDOM(): false {
    return false
  }

  exportDOM(): lexical.DOMExportOutput {
    const element = document.createElement('div')
    element.setAttribute('data-lexical-node-key', this.__key)
    // 导入时还没有设置对应的样式
    return { element }
  }

  // 更新组件的 props
  setProps(props: Partial<ImageComponentProps>) {
    const writable = this.getWritable()
    writable.__props = { ...this.__props, ...props }
  }

  // 渲染组件
  decorate(editor: lexical.LexicalEditor, config: lexical.EditorConfig): JSX.Element {
    return <ImageComponent nodeKey={this.getKey()} {...this.__props} />
  }
}

export function $createImageNode(props?: ImageComponentProps): ImageNode {
  return new ImageNode(props)
}

export function $isImageNode(node: lexical.LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode
}
