type AdoptiumPackageInfo = {
  checksum: string;
  checksumLink: string;
  downloadCount: number;
  link: string;
  metadataLink: string;
  name: string;
  signatureLink: string;
  size: number;
};

export interface AdoptiumReleasesInfo {
  availableLtsReleases: number[];
  availableReleases: number[];
  mostRecentFeatureRelease: number;
  mostRecentFeatureVersion: number;
  mostRecentLts: number;
  tipVersion: number;
}

export interface AdoptiumReleaseDetails {
  binary: {
    architecture: string;
    downloadCount: number;
    heapSize: string;
    imageType: string;
    jvmImpl: string;
    os: string;
    project: string;
    scmRef: string;
    updateAt: string;
    installer: AdoptiumPackageInfo;
    package: AdoptiumPackageInfo;
  };
  releaseLink: string;
  releaseName: string;
  vendor: string;
}
