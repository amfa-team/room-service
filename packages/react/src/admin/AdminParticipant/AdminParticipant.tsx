import type {
  IParticipant,
  PaginationData,
} from "@amfa-team/room-service-types";
import React, { useCallback, useEffect, useState } from "react";
import type { AdminApiSettings } from "../../api/api";
import { apiPost } from "../../api/api";
import Table from "../Table/Table";

interface AdminParticipantProps {
  settings: AdminApiSettings;
}

const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Status Valid Until",
    accessor: (p: IParticipant) => {
      if (!p.statusValidUntil) {
        return "NULL";
      }
      const d = new Date(p.statusValidUntil);
      return d.toLocaleString();
    },
  },
  {
    Header: "Current Room",
    accessor: "room",
  },
  {
    Header: "Total Duration",
    accessor: (p: IParticipant) => {
      return p.roomVisits.reduce((acc, v) => acc + v.duration, 0);
    },
  },
  {
    Header: "Total Room Visists",
    accessor: (p: IParticipant) => {
      return p.roomVisits.length;
    },
  },
];

export default function AdminParticipant({ settings }: AdminParticipantProps) {
  const [currentPage, setCurrentPage] = useState<IParticipant[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [abortController, setAbortController] = useState(new AbortController());

  const fetchData = useCallback(
    (params: PaginationData) => {
      setIsLoading(true);
      setError(null);
      apiPost(
        settings,
        "admin/participant",
        {
          pagination: params,
          secret: settings.secret,
        },
        abortController.signal,
      )
        .then((data) => {
          setCurrentPage(data.page);
          setPageCount(data.pagination.pageCount);
          setCount(data.pagination.count);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError(err);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [settings, abortController],
  );

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    setAbortController(controller);

    return () => {
      controller.abort();
    };
  }, [settings]);

  if (error) {
    console.error(error);
    return <div>Oops an error occured</div>;
  }

  return (
    <Table
      // @ts-ignore
      columns={columns}
      data={currentPage}
      fetchData={fetchData}
      loading={isLoading}
      pageCount={pageCount}
      count={count}
    />
  );
}
