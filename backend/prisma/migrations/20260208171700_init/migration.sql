-- CreateTable
CREATE TABLE "api_endpoint" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_hit" (
    "id" SERIAL NOT NULL,
    "endpointId" INTEGER NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "authPresent" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_hit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_risk" (
    "id" SERIAL NOT NULL,
    "endpointId" INTEGER NOT NULL,
    "riskType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_risk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_endpoint_path_method_key" ON "api_endpoint"("path", "method");

-- AddForeignKey
ALTER TABLE "api_hit" ADD CONSTRAINT "api_hit_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "api_endpoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_risk" ADD CONSTRAINT "api_risk_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "api_endpoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
