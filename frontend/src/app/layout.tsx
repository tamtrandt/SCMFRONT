
import { AntdRegistry } from "@ant-design/nextjs-registry";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <main>{children}</main>
        </AntdRegistry>
      </body>
    </html>
  );
}
