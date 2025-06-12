import axios from "axios";
import { AdoptiumReleaseInfo } from "@renderer/interfaces";
import { AdoptiumReleaseDetails } from "@renderer/interfaces/adoptium";

export async function fetchAdoptiumReleases(): Promise<AdoptiumReleaseInfo> {
  console.log("Fetching Adoptium releases...");
  try {
    const response = await axios.get("https://api.adoptium.net/v3/info/available_releases", {
      headers: {
        accept: "application/json"
      }
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch releases: ${response.statusText}`);
    }

    const data: AdoptiumReleaseInfo = {
      availableLtsReleases: response.data.available_lts_releases,
      availableReleases: response.data.available_releases,
      mostRecentFeatureRelease: response.data.most_recent_feature_release,
      mostRecentFeatureVersion: response.data.most_recent_feature_version,
      mostRecentLts: response.data.most_recent_lts,
      tipVersion: response.data.tip_version
    };

    return data;
  } catch (error) {
    console.error("Error fetching Adoptium releases:", error);
    throw error;
  }
}

export async function fetchAdoptiumReleaseDetails(
  version: number
): Promise<AdoptiumReleaseDetails> {
  try {
    // TODO: 从Electron主进程获取
    const architecture = "x64";
    const os = "windows";
    const response = await axios.get(
      `https://api.adoptium.net/v3/assets/latest/${version}/hotspot?architecture=${architecture}&image_type=jdk&os=${os}&vendor=eclipse`,
      {
        headers: {
          accept: "application/json"
        }
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to fetch release details: ${response.statusText}`);
    }

    const data: AdoptiumReleaseDetails = {
      version,
      binary: {
        architecture: response.data[0].binary.architecture,
        downloadCount: response.data[0].binary.download_count,
        heapSize: response.data[0].binary.heap_size,
        imageType: response.data[0].binary.image_type,
        jvmImpl: response.data[0].binary.jvm_impl,
        os: response.data[0].binary.os,
        project: response.data[0].binary.project,
        updateAt: response.data[0].binary.update_at,
        installer: {
          checksum: response.data[0].binary.installer.checksum,
          checksumLink: response.data[0].binary.installer.checksum_link,
          downloadCount: response.data[0].binary.installer.download_count,
          link: response.data[0].binary.installer.link,
          metadataLink: response.data[0].binary.installer.metadata_link,
          name: response.data[0].binary.installer.name,
          signatureLink: response.data[0].binary.installer.signature_link,
          size: response.data[0].binary.installer.size
        },
        package: {
          checksum: response.data[0].binary.package.checksum,
          checksumLink: response.data[0].binary.package.checksum_link,
          downloadCount: response.data[0].binary.package.download_count,
          link: response.data[0].binary.package.link,
          metadataLink: response.data[0].binary.package.metadata_link,
          name: response.data[0].binary.package.name,
          signatureLink: response.data[0].binary.package.signature_link,
          size: response.data[0].binary.package.size
        }
      },
      releaseLink: response.data[0].release_link,
      releaseName: response.data[0].release_name,
      vendor: response.data[0].vendor
    };

    return data;
  } catch (error) {
    console.error("Error fetching Adoptium release details:", error);
    throw error;
  }
}
