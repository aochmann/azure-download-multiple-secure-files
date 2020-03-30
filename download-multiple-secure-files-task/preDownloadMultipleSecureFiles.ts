import * as path from 'path';
import * as tl from 'azure-pipelines-task-lib/task';
import * as secureFilesCommon from 'securefiles-common/securefiles-common';

const commaDelimiter: string = ',';

const main = async () => {
  try {
    tl.setResourcePath(path.join(__dirname, 'task.json'));

    const retryCount: number = getRetryCount();
    const secureFiles: string[] = getSecureFiles();
    const secureFilesPath: string[] = await downloadSecureFiles(secureFiles, retryCount);
    const existingSecureFilePath: string[] = getExistingSecureFile(secureFilesPath);
    const secureFilePathsOutput: string = getSecureFilePathsOutput(existingSecureFilePath);

    tl.setVariable('secureFilePaths', secureFilePathsOutput);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err);
  }
};

const getRetryCount = (): number => {
  let retryCount: number = parseInt(tl.getInput('retryCount') as string);

  if (isNaN(retryCount) || retryCount < 0) {
    retryCount = 5;
  }

  return retryCount;
};

const getSecureFiles = (): Array<string> => {
  const secureFiles: Array<string> = getSecureFilesWithCommaDelimiter();

  return getSecureFilePathsWithoutWhitespace(secureFiles);
};

const getSecureFilesWithCommaDelimiter = (): Array<string> => tl.getDelimitedInput('secureFiles', commaDelimiter, true);

const getSecureFilePathsWithoutWhitespace = (secureFilesPath: Array<string>): Array<string> => secureFilesPath.map(secureFilePath => secureFilePath.trim());

const downloadSecureFiles = async (secureFiles: Array<string>, retryCount: number): Promise<Array<string>> => {
  const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers(retryCount);
  const results: Promise<string>[] = secureFiles.map(async secureFile => (await secureFileHelpers.downloadSecureFile(secureFile)) as string);

  return await Promise.all<string>(results);
};

const getExistingSecureFile = (secureFilesPath: Array<string>): Array<string> => secureFilesPath.filter(secureFilePath => tl.exist(secureFilePath));

const getSecureFilePathsOutput = (secureFilesPath: Array<string>): string => secureFilesPath.join(commaDelimiter);

main();
