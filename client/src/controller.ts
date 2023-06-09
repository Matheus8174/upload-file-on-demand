import Repository from './repository';
import Service from './service';
import View from './view';

class Controller {
  constructor(
    private readonly view: View,
    private readonly repository: Repository,
    private readonly service: Service
  ) {}

  private async fileUpload() {
    const files = this.view.getFiles()

    if (!files) throw new Error('file not found')

    const file = files[0]

    this.repository.createConnection(file.name)

    this.view.uploadProgressBar(
      file.size,
      {
        listemFromServer: this.repository.listemFromServer.bind(this.repository),
        updateUserFiles: this.updateUserFiles.bind(this)
      }
    )

    const bytes = this.view.formatBytes(file.size)

    this.view.updateFileSize(bytes)

    this.view.resetFeedback()

    await this.service.uploadFile({
      file,
      emitToServer: this.repository.emitToServer.bind(this.repository),
      errHandler: this.view.updateFeedbackOnError.bind(this.view)
    })
  }

  private async updateUserFiles() {
    const allFiles = await this.service.getAllFiles()

    this.view.updateUserFiles(allFiles)
  }

  public async execute() {
    this.view.init(this.fileUpload.bind(this))

    await this.updateUserFiles()
  }
}

export default Controller
