// const { Resource } = require("@opentelemetry/resources");
// const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
// const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
// const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
// const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
// const { trace } = require("@opentelemetry/api");
// //Instrumentations
// const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
// const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
// const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
// const { registerInstrumentations } = require("@opentelemetry/instrumentation");
// //Exporter
// module.exports = (serviceName) => {
//    const exporter = new ConsoleSpanExporter();
//    const provider = new NodeTracerProvider({
//        resource: new Resource({
//            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
//        }),
//    });
//    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
//    provider.register();
//    registerInstrumentations({
//        instrumentations: [
//            new HttpInstrumentation(),
//            new ExpressInstrumentation(),
//            new MongoDBInstrumentation(),
//        ],
//        tracerProvider: provider,
//    });
//    return trace.getTracer(serviceName);
// };

const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { trace } = require("@opentelemetry/api");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");

module.exports = (serviceName) => {
   // Configure the Jaeger Exporter
   const exporter = new JaegerExporter({
       endpoint: "http://localhost:14268/api/traces", // Default Jaeger collector endpoint
   });

   // Create a NodeTracerProvider and add the exporter
   const provider = new NodeTracerProvider({
       resource: new Resource({
           [SemanticResourceAttributes.SERVICE_NAME]: serviceName, // Service name for traces
       }),
   });

   provider.addSpanProcessor(new SimpleSpanProcessor(exporter)); // Attach the exporter to the provider
   provider.register(); // Register the provider

   // Register instrumentations for HTTP, Express, and MongoDB
   registerInstrumentations({
       instrumentations: [
           new HttpInstrumentation(),
           new ExpressInstrumentation(),
           new MongoDBInstrumentation(),
       ],
       tracerProvider: provider,
   });

   return trace.getTracer(serviceName); // Return the tracer instance
};
