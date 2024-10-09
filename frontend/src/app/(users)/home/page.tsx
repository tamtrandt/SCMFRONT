

'use client';

import Footer from "@/components/pages/footer";
import Header from "@/components/pages/header";
import HeroSection from "@/components/pages/herosection";
import ProductShowcase from "@/components/pages/productshow";
import Testimonials from "@/components/pages/testimonials";



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