import React from "react";
import { Link } from "gatsby";

import DashboardLayout from "@layouts/DashboardLayout";
import SeoHead from "@components/Head";

export function Head() {
  return <SeoHead title={`Página não encontrada.`} />;
}

const Index = () => {
  return (
    <DashboardLayout>
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col gap-1 text-center text-zinc-600 dark:text-zinc-300">
          <img
            className="mx-auto w-64 max-w-screen my-4"
            src="/static/images/notfound.svg"
            alt="Not found image"
          />
          <h2 className="text-lg font-thin">Página não encontrada</h2>
          <Link
            className="text-cyan-500 hover:text-cyan-600 hover:underline"
            to="/dashboard/dashboard"
          >
            Ir para Dashboard
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
