import Controller from "./controller"
import IFilesInfo from "./dtos/IFilesInfo"
import Repository from "./repository"

type UploadProgressBarDependences = {
  listemFromServer: Repository['listemFromServer']
  updateUserFiles: Controller['updateUserFiles']
}

class View {
  private readonly fileSize = document.querySelector('#file-size') as HTMLOutputElement
  private readonly file = document.querySelector('input[type="file"]') as HTMLInputElement
  private readonly progressBar = document.querySelector('div.progress-bar') as HTMLDivElement
  private readonly feedback = document.querySelector('#feedback') as HTMLOutputElement
  private readonly fileListTitle = document.querySelector('h3') as HTMLHeadElement
  private percentLoaded: number = 0

  init(callback: () => Promise<void>) {
    this.file.addEventListener('change', () => {
      callback()

      this.percentLoaded = 0
    })
  }

  uploadProgressBar(total: number, dependences: UploadProgressBarDependences) {
    function upload(this: View, bytesFromServer: number) {
      this.percentLoaded = Math.round((bytesFromServer / total) * 100);

      this.progressBar.style.width = `${this.percentLoaded}%`;

      if(this.percentLoaded === 100) {
        this.updateFeedbackOnSuccess(),
        dependences.updateUserFiles()
      }
    }

    dependences.listemFromServer(upload.bind(this))
  }

  updateFileSize(size: string): void {
    this.fileSize.innerText = `File size: ${size}\n`
  }

  formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']

    let i = 0

    for (i; bytes >= 1024 && i < 4; i++) {
      bytes /= 1024
    }

    return `${bytes.toFixed(2)} ${units[i]}`
  }

  updateFeedbackOnError() {
    this.feedback.classList.add('text-danger')

    this.feedback.innerText = 'Fail to upload file'
  }

  updateFeedbackOnSuccess() {
    this.feedback.classList.add('text-success')

    this.feedback.innerText = 'File uploaded with sucess'
  }

  getFiles() {
    return this.file.files
  }

  resetFeedback() {
    this.feedback.innerHTML = ''
  }

  formatDate(date: Date) {
    return Intl.DateTimeFormat('pt-br').format(
      date instanceof Date
      ? date
      : new Date(date)
    )
  }

  updateUserFiles(props: IFilesInfo[]) {
    const container = document.querySelector('.list-group')

    if(!container) return;

    document.querySelectorAll('.list-group-item').forEach((e) => e.remove())

    this.fileListTitle.innerText = props.length <= 0
      ? 'Nenhum arquivo enviado para a nuvem'
      : 'Arquivos na nuvem'

    const createListItem = (props: IFilesInfo) => {
      const listItem = `
        <div href="#" class="list-group-item list-group-item-action">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${props.name}</h5>
            <small class="text-muted">${this.formatDate(props.updatedAt)}</small>
          </div>
          <p class="mb-1 my-1">${'File'}</p>
          <small class="text-muted">${this.formatBytes(props.size)}</small>
        </div>
      `

      return listItem;
    }

    props.forEach(({ name, size, updatedAt }) => {
      container.insertAdjacentHTML('beforeend', createListItem({
        name,
        size,
        updatedAt
      }))
    })
  }
}

export default View
