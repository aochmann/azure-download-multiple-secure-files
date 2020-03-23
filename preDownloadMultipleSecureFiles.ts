import path = require('path');
import tl = require('azure-pipelines-task-lib/task');
import secureFilesCommon = require('securefiles-common/securefiles-common');

const main = async () => {
  try {
    tl.setResourcePath(path.join(__dirname, 'task.json'));

    let retryCount: number = parseInt(tl.getInput('retryCount') as string);

    if (isNaN(retryCount) || retryCount < 0) {
      console.log('yes we have nan');
      retryCount = 5;
    }

    const secureFiles: string[] = getSecureFiles();
    const secureFilesPath: string[] = await downloadSecureFiles(secureFiles, retryCount);
    const secureFilePathsOutput: string = secureFilesPath.filter(secureFilePath => tl.exist(secureFilePath)).join(',');

    tl.setVariable('secureFilePaths', secureFilePathsOutput);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err);
  }
};

function getSecureFiles(): Array<string> {
  return tl.getDelimitedInput('secureFiles', '\n', true);
}

async function downloadSecureFiles(secureFiles: Array<string>, retryCount: number = 5): Promise<Array<string>> {
  const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers(retryCount);
  const results: Promise<string>[] = secureFiles.map(async secureFile => (await secureFileHelpers.downloadSecureFile(secureFile)) as string);
  return await Promise.all<string>(results);
}

main();
