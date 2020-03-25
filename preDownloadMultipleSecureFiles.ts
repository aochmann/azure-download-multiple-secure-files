import path = require('path');
import tl = require('azure-pipelines-task-lib/task');
import secureFilesCommon = require('securefiles-common/securefiles-common');

const commaDelimiter: string = ',';
const newLineDelimiter: string = '\n';

const main = async () => {
  try {
    tl.setResourcePath(path.join(__dirname, 'task.json'));

    let retryCount: number = parseInt(tl.getInput('retryCount') as string);

    if (isNaN(retryCount) || retryCount < 0) {
      retryCount = 5;
    }

    const secureFiles: string[] = getSecureFiles();
    const secureFilesPath: string[] = await downloadSecureFiles(secureFiles, retryCount);
    const existingSecureFilePath: string[] = getExistingSecureFile(secureFilesPath);
    const secureFilePathsOutput: string = getSecureFilePathsOutput(existingSecureFilePath);

    tl.setVariable('secureFilePaths', secureFilePathsOutput);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err);
  }
};

const getSecureFiles = (): Array<string> => {
  let secureFiles: Array<string> = getSecureFilesWithNewLineDelimiter();

  secureFiles = hasCommaSeparatedValues(secureFiles)
    ? getSecureFilesWithCommaDelimiter()
    : secureFiles;

  return getSecureFilePathsWithoutWhitespace(secureFiles);
}

const getSecureFilesWithNewLineDelimiter = (): Array<string> => tl.getDelimitedInput('secureFiles', newLineDelimiter, true);

const getSecureFilesWithCommaDelimiter = (): Array<string> => tl.getDelimitedInput('secureFiles', commaDelimiter, true);

const hasCommaSeparatedValues = (secureFiles: Array<string>): boolean => secureFiles !== null
  && (secureFiles.length <= 0 || (secureFiles.length == 1 && secureFiles[0].includes(commaDelimiter)));

const getSecureFilePathsWithoutWhitespace = (secureFilesPath: Array<string>): Array<string> => {
  return secureFilesPath.map(secureFilePath => secureFilePath.trim());
}

const downloadSecureFiles = async (secureFiles: Array<string>, retryCount: number = 5): Promise<Array<string>> => {
  const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers(retryCount);
  const results: Promise<string>[] = secureFiles.map(async secureFile => (await secureFileHelpers.downloadSecureFile(secureFile)) as string);
  return await Promise.all<string>(results);
}

const getExistingSecureFile = (secureFilesPath: Array<string>): Array<string> => secureFilesPath.filter(secureFilePath => tl.exist(secureFilePath));

const getSecureFilePathsOutput = (secureFilesPath: Array<string>): string => secureFilesPath.join(commaDelimiter);

main();
