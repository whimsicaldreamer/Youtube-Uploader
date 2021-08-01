<template>
<div>
  <file-pond 
    ref="pond"
    credits="false"
    :allowMultiple="true"
    :allowRevert="false"
    :acceptedFileTypes="['video/*']"
    maxFileSize="500MB"
    @updatefiles="filesUpdated"
    instantUpload="false"
  />

  <button v-if="fileCount > 0" class="upload_button">{{ uploadButtonText }}</button>
</div>
</template>

<script>
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
)

export default {
  name: 'FileUploader',
  components: {
    FilePond
  },
  data () {
    return {
      filesQueue: []
    }
  },
  computed: {
    fileCount () {
      return this.filesQueue.length 
    },
    uploadButtonText () {
      const total = this.fileCount
      return total > 1 ? `Upload ${total} Files` : `Upload ${total} File`
    }
  },
  methods: {
    filesUpdated () {
      this.filesQueue = this.$refs.pond.getFiles()
    }
  }
}
</script>