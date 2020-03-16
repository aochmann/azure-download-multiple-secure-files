import path = require('path');
import secureFilesCommon = require('securefiles-common/securefiles-common');
import tl = require('azure-pipelines-task-lib/task');

async function run() {
  try {
    tl.setResourcePath(path.join(__dirname, 'task.json'));

    let retryCount: number = parseInt(tl.getInput('retryCount') as string);

    if (isNaN(retryCount) || retryCount < 0) {
      retryCount = 5;
    }

    let secureFilePaths: string[] = new Array<string>();

    const secureFiles: string[] = tl.getDelimitedInput('secureFiles', '\n', true);
    const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers(retryCount);

    secureFiles.forEach(async secureFile => {
      let secureFilePath: string = await secureFileHelpers.downloadSecureFile(secureFile);

      if (tl.exist(secureFilePath)) {
        secureFilePaths.push(secureFilePath);
        tl.setVariable('secureFilePaths', secureFilePaths.join(','));
      }
    });
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err);
  }
}

await run();
