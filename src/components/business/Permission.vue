<template>
  <v-dialog
    v-model="dialog"
    max-width="50vw"
    content-class="rounded-xl -mt-20"
  >
    <v-card>
      <v-card-title class="text-2xl justify-center">
        授权协议
      </v-card-title>

      <v-card-text>
        隐私政策尊重并保护所有使用隐私政策网络服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，我们的隐私政策涵盖我们收集，使用，披露，传输和存储您的信息的方式。但隐私政策将以高度的勤勉、审慎义务对待这些信息。隐私政策会不时更新本隐私权政策。 您在同意隐私政策络服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于隐私政策络服务使用协议不可分割的一部分。你不是一定要提供我们要求的个人信息，但在许多情况下，如果你选择不提供，我们将无法为你提供我们的产品或服务，也无法回应你遇到的任何问题。<br />

        一、我们如何收集信息<br />
        我们根据合法、正当、必要的原则，仅收集实现产品功能所必要的信息。我们公司收集个人信息的主要来源有：您提供的信息。我们会出于如下产品功能的目的，收集和使用您的个人信息，如您不提供相关信息或不同意我们收集相关信息，您可能无法注册成为我们的用户或无法享受我们提供的某些服务，或无法达到好的服务效果。<br />

        经您同意后收集的信息：<br />

        为向您提供更便捷、更优质、个性化的产品或服务，我们的部分产品和服务的个别特定功能可能需要您提供特定的个人敏感信息来实现。若您选择不提供该类信息，则可能无法正常使用对应功能，但不影响您使用服务中的其他功能。这些功能包括：<br />

        （1）基于摄像头（相机）的应用功能：您可在开启相机/摄像头权限后完成视频拍摄、拍照、扫码以及人脸识别的功能。未来我们可能会将人脸识别技术应用于更多场景，但那时我们会再次与您确认您是否愿意我们使用您的面部信息来实现这些扩展功能。<br />

        （2）基于相册（图片库/视频库）的图片/视频访问及上传的应用功能：您可在开启相册权限后使用对应功能对你的照片/图片/视频进行编辑处理。<br />
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="green darken-1"
          text
          large
          @click="dialog = false"
        >
          拒绝
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          large
          @click="$emit('accept'), dialog = false"
        >
          同意
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
  }),

  methods: {
    open() {
      this.dialog = true
    },
    close() {
      this.dialog = false
    },
  },
}
</script>
