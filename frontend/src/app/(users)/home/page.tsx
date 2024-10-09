

'use client';

import Footer from "@/components/users/home/footer";
import Header from "@/components/users/home/header";
import HeroSection from "@/components/users/home/herosection";
import ProductShowcase from "@/components/users/home/productshow";
import Testimonials from "@/components/users/home/testimonials";



export default function HomePage() {
    return (
        <div>
            <Header />
            <HeroSection />
            <ProductShowcase />
            <Testimonials />
            <Footer />
        </div>
    );
}