import IFilesInfo from "./dtos/IFilesInfo";

type Callback<T> = (param: T) => void;

type UploadFileProps = {
  file: File,
  errHandler: Callback<void>,
  emitToServer: (ev: string, chunk?: any) => void
}

class Service {
  async uploadFile(dependencies: UploadFileProps) {
    const writableStream = new WritableStream({
      write(chunk) {
        dependencies.emitToServer('upload', chunk)
      },
    })

    try {
      await dependencies.file
        .stream()
        .pipeTo(writableStream)

      dependencies.emitToServer('finally')
    } catch {
      dependencies.errHandler()
    }
  }

  async getAllFiles() {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/files`, {method: 'GET'});

    const resJson: IFilesInfo[] = await response.json();

    return resJson;
  }
}

export default Service
