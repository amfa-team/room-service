import type { IRoom, PaginationData } from "@amfa-team/types";
import React, { useCallback, useEffect, useState } from "react";
import type { AdminApiSettings } from "../../api/api";
import { apiPost } from "../../api/api";
import Table from "../Table/Table";

interface AdminRoomProps {
  settings: AdminApiSettings;
}

const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Space ID",
    accessor: "spaceId",
  },
  {
    Header: "Participants",
    accessor: (room: IRoom) => room.participants.length,
  },
  {
    Header: "Live",
    accessor: (room: IRoom) => (room.live ? "TRUE" : "FALSE"),
  },
];

export default function AdminRoom({ settings }: AdminRoomProps) {
  const [currentPage, setCurrentPage] = useState<IRoom[]>([]);
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
        "admin/room",
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
