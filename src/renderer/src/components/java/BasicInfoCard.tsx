import { clsx } from "clsx";
import dayjs from "dayjs";
import { AdoptiumReleaseDetails } from "@renderer/interfaces";
import { SimpleCard } from "../common";

export function JavaBasicInfoCard({
  details,
}: {
  details: AdoptiumReleaseDetails;
}): React.JSX.Element {
  const styles = {
    title: clsx("mb-4 text-xl font-semibold text-gray-900 dark:text-white"),
    dt: clsx("text-sm font-medium text-gray-500 dark:text-gray-400"),
    dd: clsx("mt-1 font-mono text-sm text-gray-900 dark:text-white"),
  };

  return (
    <SimpleCard className="mb-6 h-auto w-full p-6">
      <h2 className={styles.title}>基本信息</h2>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className={styles.dt}>架构（本机）</dt>
          <dd className={styles.dd}>{details.binary.architecture}</dd>
        </div>
        <div>
          <dt className={styles.dt}>操作系统（本机）</dt>
          <dd className={styles.dd}>{details.binary.os}</dd>
        </div>
        <div>
          <dt className={styles.dt}>堆内存大小</dt>
          <dd className={styles.dd}>{details.binary.heapSize}</dd>
        </div>
        <div>
          <dt className={styles.dt}>镜像类型</dt>
          <dd className={styles.dd}>{details.binary.imageType.toUpperCase()}</dd>
        </div>
        <div>
          <dt className={styles.dt}>项目</dt>
          <dd className={styles.dd}>{details.binary.project}</dd>
        </div>
        <div>
          <dt className={styles.dt}>更新时间</dt>
          <dd className={styles.dd}>
            {dayjs(details.binary.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
          </dd>
        </div>
      </dl>
    </SimpleCard>
  );
}
