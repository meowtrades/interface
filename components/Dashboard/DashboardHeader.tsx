/** @format */

const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-body text-muted-foreground">
            Welcome back! Here&apos;s your trading overview.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="text-right">
            <p className="text-caption text-muted-foreground">Last updated</p>
            <p className="text-caption font-medium text-foreground">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
