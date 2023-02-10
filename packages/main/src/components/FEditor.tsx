import { connect, mapProps } from '@formily/vue'
import { defineComponent } from 'vue'
import { Editor } from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/toastui-editor.css'

const Component = defineComponent({
  name: 'FEditor',
  props: {
    value: String,
    height: String,
    maxlength: Number,
  },
  setup(props, { emit }) {
    const editorRef = ref<any>(null)

    watch(() => props.value, () => {
      editorRef.value?.editor.setHTML(props.value, false)
    })

    return () => (
      <Editor
        ref={editorRef}
        initialEditType="wysiwyg"
        previewStyle="vertical"
        initialValue={props.value}
        height={props.height}
        options={{
          autofocus: false,
          hideModeSwitch: true,
          toolbarItems: [
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol'],
          ],
        }}
        on={{
          blur: () => {
            const editor = editorRef.value?.editor
            const html = editor.getHTML()
            const text = editor.wwEditor.el.textContent
            emit('change', text.trim() === '' ? '' : html)
          },
        }}
      />
    )
  },
})

export default connect(Component, mapProps({}))
