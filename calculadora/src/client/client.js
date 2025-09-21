const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/../contrato/aluno.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true,
});

const protos = grpc.loadPackageDefinition(packageDefinition);

function main() {
  const client = new protos.AlunoService(
    "localhost:4000",
    grpc.credentials.createInsecure()
  );

  const aluno = { email: "criar@aluno.com", nome: "NovoAluno", matricula: "123456" }
  console.log("Request:", aluno);
  client.criarAluno(
    aluno,
    function (err, response) {
      console.log("Response:", response);
    }
  );

  const alunoConsulta = { matricula: 123 }
  console.log("Request:", alunoConsulta);
  
  client.getAlunoByMatricula(alunoConsulta, function (err, response) {
    console.log("Response:", response);
  });
}

main();