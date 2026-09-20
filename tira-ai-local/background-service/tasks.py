from invoke import task


@task
def build(ctx):
    ctx.run(
        "pex --python-shebang /bin/python3 --only-binary markupsafe --complete-platform ./platforms/debian.json --complete-platform ./platforms/cubbli.json --complete-platform ./platforms/cubbli2.json -o ./dist/background-service.pex  -c cli ."
    )


@task
def test(ctx):
    ctx.run("poetry run pytest src/tests --color=yes", pty=True)


@task
def lint(ctx):
    ctx.run("poetry run pylint src")
