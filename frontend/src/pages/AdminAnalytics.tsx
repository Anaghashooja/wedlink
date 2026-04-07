import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import AdminSidebar from '../components/AdminSidebar';

const Analytics = () => {
  return (
    <div className="ml-64 p-10 3xl:p-24 bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="mb-10">
        <h1 className="text-4xl 3xl:text-8xl font-bold text-slate-800">Business Intelligence</h1>
        <p className="text-gray-500 3xl:text-4xl">Real-time platform analytics and user trends</p>
      </div>

      {/* THE POWER BI CONTAINER */}
      <div className="bg-white p-4 3xl:p-10 rounded-[2rem] 3xl:rounded-[4rem] shadow-2xl border border-rose-100 overflow-hidden h-[700px] 3xl:h-[1400px]">
        <PowerBIEmbed
          embedConfig={{
            type: 'report',   // Supported types: report, dashboard, tile
            id: 'YOUR_REPORT_ID_HERE',
            embedUrl: 'YOUR_EMBED_URL_HERE',
            accessToken: 'YOUR_ACCESS_TOKEN_HERE',
            tokenType: models.TokenType.Embed,
            settings: {
              panes: {
                filters: { expanded: false, visible: true }
              },
              background: models.BackgroundType.Transparent,
            }
          }}
          cssClassName={"w-full h-full"}
        />
      </div>
    </div>
  );
};

export default Analytics;