const grpc = require('@grpc/grpc-js')
const protoLoader = require("@grpc/proto-loader")

const PROTO_PATH = __dirname + "/../contrato/aluno.proto"

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true
})

const protos = grpc.loadPackageDefinition(packageDefinition)

function criarAluno(call, callback) {
  const { email, nome, matricula } = call.request;
  console.log('criarAluno\nREQUEST:')
  console.log(matricula, nome, email)
  console.log('\n\n')

  callback(null, {
    matricula: 1,
    email: "aluno@aluno.com",
    nome: "Jovem"
  })
}

function getAlunoByMatricula(call, callback) {
  const { matricula } = call.request
  console.log('getAlunoByMatricula\nREQUEST:')
  console.log(matricula)
  console.log('\n\n')

  callback(null, {
    matricula: 5,
    email: "outro@aluno.com",
    nome: "Aluno"
  })
}

async function main() {
  const server = new grpc.Server();
  server.addService(protos.AlunoService.service, {
    criarAluno,
    getAlunoByMatricula,
  });
  await server.bindAsync("0.0.0.0:4000",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err)
      } else {
        server.start();
        console.log("Server is running");
      }
    });
}

main();