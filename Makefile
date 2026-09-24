jenkins-build-dev:
	@echo "Building image dev"
	@docker build -t ${IMAGE} -f ${DOCKERFILE} --build-arg NUXT_PUBLIC_ASSET_URL=${NUXT_PUBLIC_ASSET_URL} --build-arg NUXT_PUBLIC_API_URL=${NUXT_PUBLIC_API_URL} --build-arg NUXT_PUBLIC_RECAPTCHA=${NUXT_PUBLIC_RECAPTCHA} --build-arg NUXT_PUBLIC_GA_ID=${NUXT_PUBLIC_GA_ID} --build-arg NUXT_PUBLIC_CDN_URL=${NUXT_PUBLIC_CDN_URL} .

jenkins-build-uat:
	@echo "Building image uat"
	@docker build -t ${IMAGE} -f ${DOCKERFILE} .

jenkins-build-prod:
	@echo "Building image prod"
	@docker build -t ${IMAGE} -f ${DOCKERFILE} .