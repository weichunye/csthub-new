import md5 from 'js-md5'
import fetch from './fetch'
// 分片上传
/*
* 分片上传函数 支持多个文件
* @param options
* options.file 表示源文件
* options.pieceSize 表示需要分片的大小 默认是5m
* options.chunkUrl 分片上传的后端地址
* options.fileUrl 整个文件的上传地址
* progress 进度回调
* success 成功回调
* error 失败回调
*
*/
export const uploadByPieces = ({files, chunkUrl, fileUrl, pieceSize = 5,bucketName,dirpath,progress, success, error}) => {
  if (!files || !files.length) return
  // 上传过程中用到的变量
  let fileList = [] // 总文件列表
  let progressNum = 1 // 进度
  let successAllCount = 0 // 上传成功的片数
  // let currentAllChunk = 0 // 当前上传的片数索引
  let AllChunk = 0 // 所有文件的chunk数之和
  let AllFileSize = 0 // 所有文件size
  // 获取md5
  const readFileMD5 = (files) => {
    // 读取每个文件的md5
    files.map((file, index) => {
      let fileRederInstance = new FileReader()
      fileRederInstance.readAsBinaryString(file)
      fileRederInstance.addEventListener('load', e => {
        let fileBolb = e.target.result
        let fileMD5 = md5(fileBolb)
        if (!fileList.some((arr) => arr.md5 === fileMD5)) {
          fileList.push({md5: fileMD5, name: file.name, file})
          AllFileSize = AllFileSize + file.size
        }
        if (index === files.length - 1) readChunkMD5(fileList)
      }, false)
    })
  }
  const getChunkInfo = (file, currentChunk, chunkSize) => {
    let start = currentChunk * chunkSize
    let end = Math.min(file.size, start + chunkSize)
    let chunk = file.slice(start, end)
    return { start, end, chunk }
  }
  // 针对每个文件进行chunk处理
  const readChunkMD5 = (fileList) => {
    fileList.map((currentFile, fileIndex) => {
      // console.log("pieceSize----",pieceSize)
      const chunkSize = pieceSize * 1024 * 1024 // 5MB一片
      // const chunkSize = pieceSize * 1024 * 102 // 5MB一片
      const chunkCount = Math.ceil(currentFile.file.size / chunkSize) // 总片数
      // console.log("tttt",chunkCount)
      AllChunk = AllChunk + chunkCount // 计算全局chunk数
      console.log("AllChunk----",AllChunk)
      // let fileSize = currentFile.file.size // 文件大小
      // 针对单个文件进行chunk上传
      if (AllChunk==0){
        error("上传文件内容不能为空")
        return
      }
      for (let i = 0; i < chunkCount; i++) {
        // console.log("i+++",i)
        const chunkobj = getChunkInfo(currentFile.file, i, chunkSize)
        const chunk=chunkobj.chunk
        // console.log("chunk----",chunk.size)
        let chunkFR = new FileReader()

        chunkFR.readAsBinaryString(chunk)
        chunkFR.addEventListener('load', e => {
          // console.log("jj+++",i)
          let chunkBolb = e.target.result
          let chunkMD5 = md5(chunkBolb)
          this.readingFile = false
          uploadChunk(currentFile, {chunkMD5, chunkobj, currentChunk: i, chunkCount}, fileIndex)
        }, false)
      }
    })
  }
  // 更新进度
  const progressFun = () => {
    // console.log("successAllCount",successAllCount);
    // console.log("AllChunk",AllChunk);
    progressNum = Math.ceil(successAllCount / AllChunk * 100)
    progress(progressNum)
  }
  // 对分片已经处理完毕的文件进行上传
  const uploadFile = (currentFile) => {
    let makeFileForm = new FormData()
    makeFileForm.append('md5', currentFile.fileMD5)
    makeFileForm.append('file_name', currentFile.name)
    fetch({ // 合并文件
      type: 'post',
      url: fileUrl,
      data: makeFileForm
    }).then(res => {
      progressFun()
      res.file_name = currentFile.name
      // success && success(res)
      successAllCount++
    }).catch(e => {
      error && error(e)
    })
  }
  const uploadChunk = (currentFile, chunkInfo, fileIndex) => {
    let fetchForm = new FormData()
    fetchForm.append('chunk_offset', chunkInfo.chunkobj.start)
    fetchForm.append('chunk', chunkInfo.chunkobj.chunk)
    fetchForm.append('chunk_size',chunkInfo.chunkobj.end -chunkInfo.chunkobj.start)
    if (dirpath==""){
      fetchForm.append('url', 'http://159.226.91.150/api/v1/obj/'+bucketName+'/'+currentFile.name+'/')
    }else{
      fetchForm.append('url', 'http://159.226.91.150/api/v1/obj/'+bucketName+'/'+dirpath+'/'+currentFile.name+'/')
    }
    // console.log("chunk-----",chunkInfo.chunkobj.chunk)
    function sleep(ms) {
      return new Promise(resolve =>
        setTimeout(resolve, ms)
      )
    }
    fetch({
      type: 'post',
      url: chunkUrl,
      data: fetchForm
    }).then(res => {
      // console.log("res.code----",res)
      if (res.code==0){
        progressFun()
        // currentAllChunk++
        if (chunkInfo.currentChunk < chunkInfo.chunkCount - 1) {
          successAllCount++
        } else {
          successAllCount++
          progressFun()
          // 当总数大于等于分片个数的时候  by wk注释
          if (chunkInfo.currentChunk >= chunkInfo.chunkCount - 1) {
            sleep(15000).then(()=>{
              success && success(res)
            })
            // uploadFile(currentFile, fileIndex)
          }
        }
      }else
      {
        error && error(res.msg)
      }
    }).catch((e) => {
      error && error(e)
    })
  }
  readFileMD5(files) // 开始执行代码
}
