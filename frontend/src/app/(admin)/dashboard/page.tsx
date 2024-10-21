/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import AdminCard from "@/components/admin/card";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";



const DashboardPage = () => {



    return (
        <div>
            <AdminCard />
        </div>
    );
};

export default DashboardPage;
