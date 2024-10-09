// layouts/HomeLayout.tsx
import React from 'react';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <header>
                <nav>
                    <div className="logo">Thirdweb</div>
                    <ul className="nav-links">
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Docs</a></li>
                        <li><a href="#">Pricing</a></li>
                    </ul>
                </nav>
            </header>
            <main>{children}</main>
            <footer>
                <p>© 2024 Thirdweb. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomeLayout;
