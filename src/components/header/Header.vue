<script setup lang="ts">
defineProps<{
	title: string
}>()
</script>

<style lang="scss" scoped>
.content-header {
	display: flex;
	width: 100%;
	height: 64px;
	background-color: $surface-0;
	border-bottom: 1px solid $surface-1;
	padding-inline: 15rem;
	align-items: center;
}

.header-logo {
	display: flex;
	align-items: center;
	width: fit-content;
	height: 100%;
	text-decoration: none;
	color: inherit;

	transition: all 150ms ease;

	&:hover {
		text-decoration: none;
		cursor: pointer;
		filter: brightness(1.2);
	}
}

.header-logo-icon {
	width: 54px;
	height: 54px;
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 2.5px;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.025);

	transition: all 150ms ease;

	& > img {
		width: calc(100% - 10px);
		height: calc(100% - 10px);
		object-fit: contain;
		display: block;

		&:active {
			translate: 0px 1px;
		}
	}
}

.header-logo-title {
	font-size: 1.25rem;
	font-weight: bold;
}
</style>

<template>
  <header class="content-header">
		<div>
			<a href="/" class="header-logo">
				<div class="header-logo-icon">
					<img src="/images/button_styled_icons/app.svg" alt="DSL KeyPad Logo">
				</div>
				<p class="header-logo-title">DSL KeyPad</p>
			</a>
		</div>
		<div></div>
		<div></div>
  </header>
</template>
